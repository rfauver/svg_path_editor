import { v4 as uuidv4 } from 'uuid';

export default function withUuids(strings) {
  return strings.map(str => ({ raw: str, uuid: uuidv4() }));
}
