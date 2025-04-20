export default function SignInRedirect() {
  return <div>Redirecting...</div>;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: "/auth/signin",
      permanent: true,
    },
  };
}
