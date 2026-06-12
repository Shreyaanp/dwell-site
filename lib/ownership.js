export function userFilterForInstall(installId) {
  return {
    $or: [
      { installId },
      { installIds: installId },
    ],
  };
}

export function linkedInstallIds(user, installId) {
  const ids = new Set([installId]);
  if (user?.installId) ids.add(user.installId);
  if (Array.isArray(user?.installIds)) {
    user.installIds.forEach((id) => {
      if (id) ids.add(id);
    });
  }
  return [...ids];
}

export async function resolveLinkedInstallScope(database, installId) {
  const user = await database.collection("users").findOne(
    userFilterForInstall(installId),
    { projection: { installId: 1, installIds: 1 } },
  );
  const installIds = linkedInstallIds(user, installId);
  const canonicalInstallId = user?.installId || installId;
  const dataFilter = installIds.length === 1
    ? { installId }
    : { installId: { $in: installIds } };

  return {
    canonicalInstallId,
    dataFilter,
    installIds,
  };
}
