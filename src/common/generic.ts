import JSZip from "jszip"
import { AssignedBranche, Geography, Lot, Page, Rows } from "../models"
import { BranchesService, GeographyService, LotsService, PagesService, RowsService } from "../services/service_markets"
import { message } from 'antd'

export const getTextColor = (hexcolor: string): string => {
    var r = parseInt(hexcolor.substr(1, 2), 16)
    var g = parseInt(hexcolor.substr(3, 2), 16)
    var b = parseInt(hexcolor.substr(4, 2), 16)
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
    // Return new color if to dark, else return the original
    return (yiq < 40) ? '#2980b9' : "black"
}

export const getFileName = (key: string) => {
    switch (key) {
        case "pages":
            return "paginas.json"
        case "lots":
            return "locaties.json"
        case "geography":
            return "geografie.json"
        case "branches":
            return "branches.json"
        case "rows":
            return "markt.json"
        default:
            return ""
    }
}
export const zipMarket = (marketDayId: string) => {
    const zip = new JSZip();

    // Grab all the localstorage objects and put them in a single zipfile for download!
    ["branches", "geography", "lots", "pages", "rows"].forEach((key: string) => {
        const data = localStorage.getItem(`bwdm_cache_${marketDayId}_${key}`)
        if (data) {
            zip.file(getFileName(key), data)
        }
    })

    zip.generateAsync({ type: "base64" })
        .then(function (content) {
            downloadObjectAsZip("data:application/zip;base64," + content, `${marketDayId}.zip`)
        });
}


export const uploadMarket = async (marketDayId: string) => {
    let success: string[] = []
    let errors: string[] = []

    const _branchesFromStorage: string | null = localStorage.getItem(`bwdm_cache_${marketDayId}_branches`)
    const _geographyFromStorage: string | null = localStorage.getItem(`bwdm_cache_${marketDayId}_geography`)
    const _lotsFromStorage: string | null = localStorage.getItem(`bwdm_cache_${marketDayId}_lots`)
    const _pagesFromStorage: string | null = localStorage.getItem(`bwdm_cache_${marketDayId}_pages`)
    const _rowsFromStorage: string | null = localStorage.getItem(`bwdm_cache_${marketDayId}_rows`)
    if (_branchesFromStorage) {
        await new BranchesService().update(marketDayId, JSON.parse(_branchesFromStorage) as AssignedBranche[]).then((result) => {
            if (result === "ok") {
                success.push("branches")
                //message.success(`Upload branches.json voor ${marketDayId} gelukt.`)
            } else {
                errors.push("branches")
                //message.error(`Upload branches.json voor ${marketDayId} mislukt.`)
            }
        })
    }
    if (_geographyFromStorage) {
        await new GeographyService().update(marketDayId, JSON.parse(_geographyFromStorage) as Geography).then((result) => {
            if (result === "ok") {
                success.push("geografie")
                //message.success(`Upload geografie.json voor ${marketDayId} gelukt.`)
            } else {
                errors.push("geografie")
                //message.error(`Upload geografie.json voor ${marketDayId} mislukt.`)
            }
        })
    }
    if (_lotsFromStorage) {
        await new LotsService().update(marketDayId, JSON.parse(_lotsFromStorage) as Lot[]).then((result) => {
            if (result === "ok") {
                success.push("locaties")
                //message.success(`Upload locaties.json voor ${marketDayId} gelukt.`)
            } else {
                errors.push("locaties")
                //message.error(`Upload locaties.json voor ${marketDayId} mislukt.`)
            }
        })
    }
    if (_pagesFromStorage) {
        await new PagesService().update(marketDayId, JSON.parse(_pagesFromStorage) as Page[]).then((result) => {
            if (result === "ok") {
                success.push("pagina's")
                //message.success(`Upload paginas.json voor ${marketDayId} gelukt.`)
            } else {
                errors.push("pagina's")
                //message.error(`Upload paginas.json voor ${marketDayId} mislukt.`)
            }
        })
    }
    if (_rowsFromStorage) {
        await new RowsService().update(marketDayId, JSON.parse(_rowsFromStorage) as Rows).then((result) => {
            if (result === "ok") {
                success.push("markt")
                //message.success(`Upload markt.json voor ${marketDayId} gelukt.`)
            } else {
                errors.push("markt")
                //message.error(`Upload markt.json voor ${marketDayId} mislukt.`)
            }
        })
    }
    if (success.length > 0) {
        message.success(`Upload ${success.join(", ")} voor ${marketDayId} geslaagd.`)
    }
    if (errors.length > 0) {
        message.error(`Upload ${errors.join(", ")} voor ${marketDayId} mislukt.`)
    }
}

export const downloadObjectAsZip = (base64: string, filename: string) => {
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", base64);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}