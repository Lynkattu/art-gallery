import './personalArtSideNav.css';

type viewOptionProps = {
  setSelected: (option: string) => void;
};

function PersonalArtSideNav({ setSelected }: viewOptionProps) {
  return (
    <div className="personal-art-side-nav">

      <button onClick={() => setSelected('add-new-art')}>Add New Art</button>
      <button onClick={() => setSelected('view-collection')}>View Collection</button>
    </div>
  );
}

export default PersonalArtSideNav;