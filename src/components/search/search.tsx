import './search.css';
import { Search } from "lucide-react";
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

import { useSearch } from "@src/store/store";


const SearchBar = () =>{
  const searchType = useSearch((state:any) => state.searchType);
  const setSearchType = useSearch((state:any) => state.setSearchType);
  const setSearchValue = useSearch((state:any) => state.setSearchValue);


  return (
    <InputGroup className="w-full search-container">
      <InputGroupAddon>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button className="search-button"><Search />{searchType}:</Button>} />
          <DropdownMenuContent className="w-40 dropmenu" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Search By</DropdownMenuLabel>
              <DropdownMenuSeparator></DropdownMenuSeparator>
              <DropdownMenuItem onClick={()=>{setSearchType('name')}}>Name</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{setSearchType('mobile')}}>Mobile</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{setSearchType('email')}}>Email</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{setSearchType('address')}}>Address</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." onChange={(e)=>{setSearchValue(e.target.value)}} />
    </InputGroup>
  )
}
export default SearchBar;