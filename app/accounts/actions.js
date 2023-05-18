"use server";

function patchAction(data) {
  const name = data.get("name");
  const description = data.get("description");
  const currency = data.get("currency");
  const icon = data.get("icon");

  if (!name || !currency || !icon) {
    throw new Error("invalid inputs");
  }

  console.log(">>> ok", { name, description, currency, icon });
}

function timeout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 5000);
  });
}

async function deleteAction(data) {
  await timeout();
  console.log(">>>delete", data);
}

export { patchAction, deleteAction };
