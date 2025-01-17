import { UserPage } from "@/components/Page/user";
import Container from "@/components/layout/Header/Container";
import { Header } from "@/components/layout/Header/Header";
import Page from "@/components/layout/Page";
import SEO from "@/components/layout/SEO";
import { UserDataType, getUserData } from "@/components/util/getUserData";

export default function page({ userData }: { userData: UserDataType }) {
  return (
    <>
      <SEO />
      <Container>
        <Header page={13} userData={userData} />
        <Page isFocus>
          <UserPage userData={userData} />
        </Page>
      </Container>
    </>
  );
}

export async function getServerSideProps(context: { req: any; res: any }) {
  const { req, res } = context;
  // 쿠키 검사 및 유저 데이터 추출 & 새 유저 만들기
  const userData = await getUserData(res, req);
  return { props: { userData } };
}
