import { GetStaticProps, GetStaticPropsContext } from 'next';

export default function withGetStaticProps(
  getStaticProps: GetStaticProps
): GetStaticProps {
  return async (context: GetStaticPropsContext) => {
    try {
      // getServerSideProps를 평소대로 실행
      return await getStaticProps(context);
    } catch (error: any) {
      console.log(error, 'error');
      if (error.response) {
        if (error.response === 404) {
          return {
            notFound: true,
          };
        }
        // 원하는 페이지로 보낸다.
        // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }

      console.error('unhandled error', error);

      throw error;
    }
  };
}
