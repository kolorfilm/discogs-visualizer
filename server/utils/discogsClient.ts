import { RequestData } from '../../types/RequestData';

const Discogs = require('disconnect').Client;

export function createDiscogsClient(accessData: RequestData) {
  return new Discogs(accessData);
}
