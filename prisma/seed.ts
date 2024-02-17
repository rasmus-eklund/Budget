import { populateEverything } from "prisma/seedHelpers/seedDb";

const main = async () => {
  await populateEverything();
};

main().catch((err) => console.log(err));
