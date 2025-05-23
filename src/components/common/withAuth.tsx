import getUserId from "~/server/getUserId";

export type WithAuthProps = { userId: string };

export function WithAuth<P extends WithAuthProps>(
  WrappedComponent: React.ComponentType<P>,
) {
  return async function AuthenticatedCOmponent(
    props: Omit<P, keyof WithAuthProps>,
  ) {
    const userId = await getUserId();
    return <WrappedComponent {...(props as P)} userId={userId} />;
  };
}
