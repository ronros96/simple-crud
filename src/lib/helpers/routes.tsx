import { useNavigate } from 'react-router';

export const useRoute = () => {
  const navigate = useNavigate();

  return {
    toLogin: () => navigate("/login",{ viewTransition: true }),
    toDashboard: () => navigate("/",{ viewTransition: true }),
    toSuccess: () => navigate("/success",{ viewTransition: true }),
    toNewProfile: () => navigate("/register",{ viewTransition: true }),
    toUpdateProfile: (id:number) => navigate(`/update/${id}`,{ viewTransition: true }),
  };
};