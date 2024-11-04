import { Center, Spinner } from "@chakra-ui/react";

interface IProps {
  loading: boolean;
  children?: React.ReactElement | string;
}

export const RenderWithLoading = ({ loading, children }: IProps) => {
  return loading ? (
    <Center pt={"1vh"}>
      <Spinner />
    </Center>
  ) : (
    children
  );
};
