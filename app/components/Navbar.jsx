import { createServerClient } from "@/lib/supabase-server";
import { toDataURL } from "@/lib/utils";
import Image from "next/image";
import NavLinks from "./NavLinks";

const getUser = async () => {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id)
    .limit(1)
    .single();
  const { data: blob } = await supabase.storage
    .from("avatars")
    .download(profile.avatar_url);
  const avatar = await toDataURL(blob);

  return { ...user, ...profile, avatar };
};

export default async function Navbar() {
  const user = await getUser();

  return (
    <nav className="min-w-[80px] basis-20 border-r-2 border-gray-300">
      <div className="flex h-full flex-col items-center justify-between">
        <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-300">
          <div className="select-none text-5xl font-bold text-gray-700">t</div>
        </div>

        <NavLinks />

        <div className=" mb-8 text-center">
          <Image
            width={64}
            height={64}
            className="rounded-full"
            src={user.avatar}
            alt="user profile"
          />
          {/* <p className="text-xs mt-4">wellcome back,</p>
          <p className='font-semibold'>{user.full_name}</p> */}
        </div>
      </div>
    </nav>
  );
}
