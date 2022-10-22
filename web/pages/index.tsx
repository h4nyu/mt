import useSWR from "swr";
import axios from "axios";

const MainPage = (props) => {
  const { data, error } = useSWR("/api/hello", axios);
  console.log(data);
  console.log(error);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  );
};

export default MainPage;
