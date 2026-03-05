export type ProducerInterval = {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
};

export type ProducerIntervalsResponse = {
  min: ProducerInterval[];
  max: ProducerInterval[];
};
