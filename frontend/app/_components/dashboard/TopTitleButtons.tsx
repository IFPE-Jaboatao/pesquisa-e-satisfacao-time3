import BasicButton from "../BasicButton";

interface Props {
    title: string,
    title_backgroundcolor: string,
    button1_title?: string,
    button1_route?: string,
    button2_title?: string,
    button2_route?: string,
    buttons?: boolean
}

export default function TopTitleButtons({title, title_backgroundcolor, button1_title, button1_route, button2_title, button2_route, buttons = true}: Props) {

    return (
        <div className="p-3 flex-row flex items-center justify-between">

            <div
                className="p-2 max-w-max rounded-xl max-lg:max-w-min"
                style={{ backgroundColor: title_backgroundcolor}}>

                  <p
                    className="font-bold text-3xl text-center"
                    style={{ color: 'var(--white)'}}
                        >{title}</p>
        
            </div>
        
            {buttons ? (
                <div className="flex-row flex gap-x-20 pr-5 pl-5 max-lg:gap-x-3 max-md:flex-col">
        
                {button1_title && button1_route ? (
                    <BasicButton route={button1_route} title={button1_title} />
                ): ''}

                {button2_title && button2_route ? (
                    <BasicButton route={button2_route} title={button2_title} />
                ): ''}
                
            </div>
            ): ''}
        
        </div>
    )
}