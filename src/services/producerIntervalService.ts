import { splitProducers } from "../utils/producerParser";
import type { ProducerInterval, ProducerIntervalsResponse } from "../types/producerIntervalTypes";

type WinnerMovieRow = {
  year: number;
  producers: string;
};

type WinnerMoviesProvider = {
  findWinnerMovies(): WinnerMovieRow[];
};

export function calculateProducerIntervals(
  movieRepository: WinnerMoviesProvider,
): ProducerIntervalsResponse {
  const winnerMovies = movieRepository.findWinnerMovies();

  const producerWinsIndex = buildProducerWinsIndex(winnerMovies);

  const calculatedIntervals = buildIntervalsFromWins(producerWinsIndex);

  return pickMinAndMaxIntervals(calculatedIntervals);
}

/*
 * Cria um índice onde cada produtor possui a lista de anos em que venceu.
 * Set evita duplicidade caso o dataset tenha registros repetidos.
 */
function buildProducerWinsIndex(winnerMovies: WinnerMovieRow[]): Map<string, Set<number>> {
  const producerWinsIndex = new Map<string, Set<number>>();

  for (const movie of winnerMovies) {
    const producers = splitProducers(movie.producers);

    for (const producerName of producers) {
      const producerYears = producerWinsIndex.get(producerName) ?? new Set<number>();

      producerYears.add(movie.year);

      producerWinsIndex.set(producerName, producerYears);
    }
  }

  return producerWinsIndex;
}

/*
 * Calcula o intervalo entre vitórias consecutivas de cada produtor.
 * A lista de anos é ordenada para garantir consistência, mesmo se o CSV vier fora de ordem.
 */
function buildIntervalsFromWins(producerWinsIndex: Map<string, Set<number>>): ProducerInterval[] {
  const intervals: ProducerInterval[] = [];

  for (const [producerName, yearsSet] of producerWinsIndex.entries()) {
    const sortedYears = Array.from(yearsSet).sort((leftYear, rightYear) => {
      return leftYear - rightYear;
    });

    if (sortedYears.length < 2) {
      continue;
    }

    for (let currentIndex = 1; currentIndex < sortedYears.length; currentIndex++) {
      const previousWinYear = sortedYears[currentIndex - 1];

      const followingWinYear = sortedYears[currentIndex];

      intervals.push({
        producer: producerName,
        interval: followingWinYear - previousWinYear,
        previousWin: previousWinYear,
        followingWin: followingWinYear,
      });
    }
  }

  return intervals;
}

/*
 * Descobre qual é o menor e o maior intervalo entre vitórias.
 * Pode existir mais de um produtor com o mesmo intervalo, por isso retornamos listas.
 */
function pickMinAndMaxIntervals(intervals: ProducerInterval[]): ProducerIntervalsResponse {
  if (intervals.length === 0) {
    return { min: [], max: [] };
  }

  let minIntervalValue = intervals[0].interval;
  let maxIntervalValue = intervals[0].interval;

  for (const intervalItem of intervals) {
    if (intervalItem.interval < minIntervalValue) {
      minIntervalValue = intervalItem.interval;
    }

    if (intervalItem.interval > maxIntervalValue) {
      maxIntervalValue = intervalItem.interval;
    }
  }

  const minIntervals = intervals
    .filter((intervalItem) => {
      return intervalItem.interval === minIntervalValue;
    })
    .sort(sortIntervalsForStableOutput);

  const maxIntervals = intervals
    .filter((intervalItem) => {
      return intervalItem.interval === maxIntervalValue;
    })
    .sort(sortIntervalsForStableOutput);

  return {
    min: minIntervals,
    max: maxIntervals,
  };
}

/*
 * Ordenação aplicada para garantir que a resposta sempre saia na mesma ordem.
 * Isso evita variações dependendo da ordem dos dados no dataset.
 */
function sortIntervalsForStableOutput(
  leftInterval: ProducerInterval,
  rightInterval: ProducerInterval,
): number {
  const producerComparison = leftInterval.producer.localeCompare(rightInterval.producer);

  if (producerComparison !== 0) {
    return producerComparison;
  }

  if (leftInterval.previousWin !== rightInterval.previousWin) {
    return leftInterval.previousWin - rightInterval.previousWin;
  }

  return leftInterval.followingWin - rightInterval.followingWin;
}
