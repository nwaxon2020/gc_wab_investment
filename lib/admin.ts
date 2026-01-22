export const isMasterAdmin = (uid: string | undefined) => {
  const admin1 = process.env.NEXT_PUBLIC_ADMIN_ID_1;
  const admin2 = process.env.NEXT_PUBLIC_ADMIN_ID_2;
  return uid === admin1 || uid === admin2;
};