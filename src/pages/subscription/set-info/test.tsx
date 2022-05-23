const TestPage = () => {
  return (
    <div>
      getServerSideProps test <br />
      getServerSideProps test <br />
      getServerSideProps test <br />
      getServerSideProps test <br />
      getServerSideProps test <br />
    </div>
  );
};
export async function getServerSideProps(context: any) {
  return {
    props: {},
  };
}
export default TestPage;
