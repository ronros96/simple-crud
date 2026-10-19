import { useNavigate, useLocation } from 'react-router';

export const useRoute = () => {
  const navigate = useNavigate();

  return {
    toLogin: () => navigate("/login",{ viewTransition: true }),
    toDashboard: () => navigate("/",{ viewTransition: true }),
    toAbout: () => navigate("/about",{ viewTransition: true }),
    toSuccess: () => navigate("/success",{ viewTransition: true }),
    toNewProfile: () => navigate("/register",{ viewTransition: true }),
    toUpdateProfile: (id:string) => navigate(`/update/${id}`,{ viewTransition: true }),
  };
};

export const usePath = () => {
  const location = useLocation();
  return location.pathname.split('/')[1];
}