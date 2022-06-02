import axios from 'axios';
import { GetStaticPropsContext } from 'next';

const TestPage = ({ menuDetail }: { menuDetail: any }) => {
  return (
    <div>
      <h1>getStaticProps test page</h1>
      <p>메뉴 이름 : {menuDetail.name}</p>
      <p>메뉴 내용 : {menuDetail.description}</p>
    </div>
  );
};
export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params?.id as string;
  const { data } = await axios(`${process.env.API_URL}/menu/v1/menus/${id}`);

  if (!id) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  return {
    props: { menuDetail: data.data },
  };
};
export default TestPage;
