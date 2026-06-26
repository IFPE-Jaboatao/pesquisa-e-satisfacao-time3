import Image from "next/image";
import HeaderLandingPage from "./_components/HeaderLandingPage";

export default function LandingPage() {

  return (
    <div>
      <HeaderLandingPage />
      <div className="self-center flex flex-1 max-md:justify-center flex-col lg:justify-between lg:flex-row min-h-max">
        <div className="lg:float-left lg:aboslute max-md:flex max-md:flex-1">
          <Image src='/logo-home.png' className="flex flex-1 self-center max-md:block hidden" width={400} height={350} alt="Pesquisa e Avaliação Logo Grande" />
          <Image src='/logo-home.png' className="self-start max-md:hidden" width={800} height={350} alt="Pesquisa e Avaliação Logo Grande" />
        </div>
        <div className="flex">
          <Image src='/call-desktop.png' className="lg:flex lg:flex-1 hidden" width={1500} height={1300} alt="Quer saber? Pesquisa" />
          <Image src='/call-mobile.png' className="flex flex-1 self-stretch lg:hidden" width={700} height={600} alt="Quer saber? Pesquisa" />
        </div>
      </div>
    </div>
  );
}
