export enum SetType {
  WARM_UP = 'warm_up',
  EFFECTIVE = 'effective',
  PYRAMID = 'pyramid', // increasing weight each set, but reps decrease
  REVERSE_PYRAMID = 'reverse_pyramid', // less weight each set, but reps increase
  SUPERSET = 'superset',
  BISET = 'biset',
  TRISET = 'triset',
  GIANT_SET = 'giant_set',
  DROP_SET = 'drop_set',
  REST_PAUSE = 'rest_pause',
  CLUSTER = 'cluster',
}
