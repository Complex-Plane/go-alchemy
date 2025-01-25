import { Button } from '@rneui/themed';
// import { processGameTreeFromFile } from '../../scripts/annotateSgf';

const ScriptButton = () => {
  const category = 'tesuji';
  const id = 0;

  const script = async () => {
    // Example usage
    console.log('Executing script...');
    // const processedSgf = await processGameTreeFromFile(category, id);
    // console.log(processedSgf);
    console.log('Completed script.');
  };

  return <Button onPress={script}>Run Script</Button>;
};

export default ScriptButton;
