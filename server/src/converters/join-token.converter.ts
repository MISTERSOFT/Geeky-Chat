import { JoinToken } from "../entities";
import { JoinTokenLiteDTO } from "../dtos";

export class JoinTokenConverter {
  toDTO(source: JoinToken) {
    if (!source) return null;

    const target = new JoinTokenLiteDTO();
    console.log('source', source);
    target.token = source.token;
    console.log('Converting... Target', target);

    return target;
  }
}
