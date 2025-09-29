import getUserId from "~/server/getUserId";

export type WithAuthProps = { userId: string };

const WithAuth = <P extends WithAuthProps>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return async function AuthenticatedCOmponent(
    props: Omit<P, keyof WithAuthProps>,
  ) {
    const userId = await getUserId();
    return <WrappedComponent {...(props as P)} userId={userId} />;
  };
};

export default WithAuth;
