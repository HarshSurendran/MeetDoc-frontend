import { useState } from "react";

const FaqSection = (body: any) => {
    const [expand, setExpand] = useState(false);
    console.log(body)

    function handleClick() {
        setExpand(!expand);
    }

  return (
    <div className=" px-5 py-3 shadow-lg bg-slate-100 mb-1">
      <div className="flex justify-between cursor-pointer" onClick={handleClick}>
        <span className="font-bold">{body.prop}</span>
        <span> 🔽 </span>
      </div>
          {expand && <p className="text-sm mt-2">
              There are several talented doctors in banglore with lot of experience.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
              magni aspernatur doloremque reprehenderit dicta molestiae? Id sapiente
              vero ab delectus, omnis dolor dignissimos eos cum ipsum repellat maxime
              asperiores modi. Lorem ipsum dolor sit amet, consectetur adipisicing
              elit. Aliquam recusandae velit facilis culpa nisi nihil rerum expedita
              labore odio consectetur minima vero quasi ab, autem consequuntur. Quod
              cum illo adipisci.
          </p>}
    </div>
  );
};

export default FaqSection;
