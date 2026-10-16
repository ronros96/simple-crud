import './search.css';
//ui
import {
  Search,
  UserSearch,
  Phone,
  AtSign,
  MapPinHouse
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
//state
import { useSearch } from "@src/store/store";

const SearchBar = () => {
  const searchType = useSearch((state: any) => state.searchType);
  const setSearchType = useSearch((state: any) => state.setSearchType);
  const setSearchValue = useSearch((state: any) => state.setSearchValue);

  const searchIcon = () => {
    switch (searchType){
      case 'name':
        return <UserSearch />
      break;
      case 'contact':
        return <Phone />
      break;
      case 'email':
        return <AtSign />
      break;
      case 'address':
        return <MapPinHouse />
      break;
    }
  }

  return (
    <InputGroup className="w-full search-container">
      <InputGroupAddon>
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button className="search-button">
              <Search className='md:flex hidden'/> 
              <span className='md:flex hidden'>{searchType}</span>
              <span className='md:hidden block'>{searchIcon()}</span>:
            </Button>}
          />
          <DropdownMenuContent className="w-40 dropmenu" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Search By</DropdownMenuLabel>
              <DropdownMenuSeparator></DropdownMenuSeparator>
              <DropdownMenuItem onClick={() => { setSearchType('name') }}>
                <UserSearch /> Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSearchType('contact') }}>
                <Phone /> Contact
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSearchType('email') }}>
                <AtSign /> Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSearchType('address') }}>
                <MapPinHouse /> Address
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." onChange={(e) => { setSearchValue(e.target.value) }} />
    </InputGroup>
  )
}
export default SearchBar;