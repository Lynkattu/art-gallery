function profile() {
  const getProfile = async () => {
  const res = await fetch("http://localhost:5000/users/profile", {
    credentials: "include"
  });
  const data = await res.json();
  console.log(data);
};
  getProfile()
  
  return <div>Profile Page - Protected</div>;
}

export default profile;