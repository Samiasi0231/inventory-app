import { businessTypesKeys } from "./modules/bussiness-types/keys";
import { usersKeys } from "./modules/users/keys";

/** Every module's query keys in one place, e.g. queryClient.invalidateQueries({ queryKey: queryKeys.users.all }). */
export const queryKeys = {
  users: usersKeys,
  businessTypes: businessTypesKeys,
};