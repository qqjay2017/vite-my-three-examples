import { customAlphabet, nanoid } from "nanoid";
export function genId() {
  return customAlphabet(
    "1234567890AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz",
    10
  )();
}
