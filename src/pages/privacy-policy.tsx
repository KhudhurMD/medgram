export default function PrivacyPolicyRedirect() {
  return <div>Redirecting...</div>
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: '/resources/privacy-policy',
      permanent: true,
    },
  }
}
