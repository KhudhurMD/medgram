export default function DataDeletionRedirection() {
  return <div>Redirecting...</div>
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: '/resources/data-deletion-instructions',
      permanent: true,
    },
  }
}
