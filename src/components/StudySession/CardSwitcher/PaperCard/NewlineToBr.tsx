import { FC } from 'react';

interface NewlineToBrProps {
  text: string;
}

const NewlineToBr: FC<NewlineToBrProps> = ({ text }) => {
  const lines = text.split('\n').map((line) => (
    <>
      {line}
      <br />
    </>
  ));

  return <>{lines}</>;
};

export default NewlineToBr;
