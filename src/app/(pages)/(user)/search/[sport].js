import { useRouter } from "next/router";

const SportPage = () => {
  const router = useRouter();
  const { sport } = router.query;

  return <h1>คุณเลือกกีฬา: {sport}</h1>;
};

export default SportPage;
