import { LucideKanban, LucidePackage, LucideShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

function Header() {
    return (
       <nav className="fixed w-full z-20 bg-background/95">
        <div className="flex justify-between  px-5 py-2.5 ">
            <Button className="flex gap-x-2  font-semibold" variant={"ghost"}><LucideKanban  /> <h1 className="text-lg font-semibold">E-G Cart</h1></Button>
              <Button variant={"outline"} ><h1>Logout</h1></Button>
        
        </div>
        <Separator/>
       </nav>
    )
}

export default Header;
