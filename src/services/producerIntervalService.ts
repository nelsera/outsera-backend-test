import type { ProducerInterval, ProducerIntervalsResponse } from "#types/producerIntervalTypes";
import { logger } from "#utils/logger";
import { splitProducers } from "#utils/producerParser";

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
  const startedAt = Date.now();

  const winnerMovies = movieRepository.findWinnerMovies();

  logger.debug({ winnerMovies: winnerMovies.length }, "[producer-intervals] loaded winner movies");

  const producerWinsIndex = buildProducerWinsIndex(winnerMovies);

  logger.debug({ producers: producerWinsIndex.size }, "[producer-intervals] built wins index");

  const calculatedIntervals = buildIntervalsFromWins(producerWinsIndex);

  logger.debug(
    { intervals: calculatedIntervals.length },
    "[producer-intervals] calculated intervals",
  );

  const result = pickMinAndMaxIntervals(calculatedIntervals);

  logger.info(
    {
      ms: Date.now() - startedAt,
      minCount: result.min.length,
      maxCount: result.max.length,
    },
    "[producer-intervals] done",
  );

  return result;
}

/*
 * Cria um índice onde cada produtor possui a lista de anos em que venceu.
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
 */
function pickMinAndMaxIntervals(intervals: ProducerInterval[]): ProducerIntervalsResponse {
  if (intervals.length === 0) {
    logger.warn("[producer-intervals] no intervals found");

    return { min: [], max: [] };
  }

  const [firstInterval] = intervals;

  let minIntervalValue = firstInterval.interval;
  let maxIntervalValue = firstInterval.interval;

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

  logger.debug(
    {
      minInterval: minIntervalValue,
      maxInterval: maxIntervalValue,
      minCount: minIntervals.length,
      maxCount: maxIntervals.length,
    },
    "[producer-intervals] picked min/max",
  );

  return {
    min: minIntervals,
    max: maxIntervals,
  };
}

/*
 * Ordenação aplicada para garantir que a resposta sempre saia na mesma ordem.
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
