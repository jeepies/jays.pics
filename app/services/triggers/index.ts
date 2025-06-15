import rename from './images/rename';
import addTag from './images/add_tag';

export interface ActionContext {
  userId: string;
  imageId: string;
  imageName: string;
  data: any;
}

export const ACTIONS: Record<string, (ctx: ActionContext) => Promise<void>> = {
  add_tag: addTag,
  rename,
};

export async function runAction(type: string, ctx: ActionContext) {
  const fn = ACTIONS[type];
  if (fn) await fn(ctx);
}
