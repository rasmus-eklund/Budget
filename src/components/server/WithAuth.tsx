import getUserId from "~/server/getUserId";

const WithAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return async function AuthenticatedComponent(props: P) {
    await getUserId();
    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;
