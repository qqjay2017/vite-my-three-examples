import { useEffect, useRef } from "react";
import { lineMap } from "./lib/map";
import './lib/index.less'
export default () => {
    const domRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!domRef.current) {
            return;
        }
        const mapObj = new lineMap(
            domRef.current,
            document.querySelector('#provinceInfo'),
            {
                tagClick: () => { }
            }
        );
        mapObj.init();
        mapObj.setTag([
            { "cityId": "110100", "cityName": "北京", "value": ["116.405289", "39.904987"], "projectCount": 3, "deviceCount": 1 },
        ])

    }, []);

    return <div ref={domRef} className="china-chart">
        <div id="provinceInfo"></div>
    </div>
}