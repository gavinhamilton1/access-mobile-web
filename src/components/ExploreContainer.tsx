interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div className="text-center absolute left-0 right-0 top-1/2 transform -translate-y-1/2">
      <strong className="text-xl leading-6">{name}</strong>
      <p className="text-base leading-5 text-gray-500 my-0">
        Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components" className="no-underline">UI Components</a>
      </p>
    </div>
  );
};

export default ExploreContainer;
