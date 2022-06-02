import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const TestPage = () => {
  const router = useRouter();
  const [id, setId] = useState<string | string[] | undefined>();
  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, []);
  return <div>{id}</div>;
};
// export const getStaticProps = async (context: GetStaticPropsContext) => {
//   const id = context.params?.id as string;
//   const { data } = await axios(`${process.env.API_URL}/menu/v1/menus/${id}`);

//   if (!id) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: true,
//       },
//     };
//   }

//   return {
//     props: { menuDetail: data.data },
//   };
// };
export default TestPage;
