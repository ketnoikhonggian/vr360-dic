krpano = document.getElementById("krpanoSWFObject");
var ngaydem = 1;
const elMenu = $(".menu");
let onUtilities = true;
const btnUtilities = $("#btn-utilities");
let firstLoad = true;

const arrScene = [
    {
        'scene': 'VIEW1',
        'multi_lookat': true,
        'dem_hlookat': '-38.899',
        'dem_vlookat': '15.893',
        'ngay_hlookat': '-43.079',
        'ngay_vlookat': '16.517',
    }
];

function setOptionHotspot(name, option, value)
{
    krpano.call(`set(hotspot[${name}].${option}, ${value});`);
}
function setOptionLayer(name, option, value)
{
    krpano.call(`set(layer[${name}].${option}, ${value});`);
}
function getNameSceneNow()
{
    let sceneNameNow = krpano.get("scene[get(xml.scene)].name")
    return sceneNameNow;
}

function iconanhienngaydem(anhieniconngaydem)
{
    if (anhieniconngaydem == 1)
    {
        krpano.call("set(layer[ngaydem_bt].scale,0.1);");
    } else
    {
        krpano.call("set(layer[ngaydem_bt].scale,0);");
    }
}

function eventKrpano()
{
    let nameScene = getNameSceneNow();
    showHiddenUtilities();
    activeThumbnail();
    if (nameScene != 'scene_tienichngoaikhu')
    {
        btnUtilities.hide();
    } else
    {
        btnUtilities.show();
    }
    if (nameScene != 'scene_Du_an_Vi_Thanh-Vi_tri_1-100m'.toLowerCase())
    {
        setOptionLayer('ngaydem_bt', 'visible', 'false');
    } else
    {
        setOptionLayer('ngaydem_bt', 'visible', 'true');
    }
    
}
function setNgayDem()
{
    let strAction = "";
    if (ngaydem == 1)
    {
        folder = "dem";
        strAction = "set(ngaydem, true);";
        strAction += "set(layer[ngaydem_bt].url, '%SWFPATH%/images/sunny.png');";
        strAction += "set(layer[ngaydem_bt].onhover,showtext('Ngày',hotspottextstyle));";
        ngaydem = 2;
        ///
        let el = $(`li[data-scene='scene_du_an_vi_thanh-vi_tri_1-100m']`);
        let thumbDem = el.find('img');
        thumbDem.attr('src', './images/thumb/1-dem.png');
    } else
    {
        folder = "ngay";
        strAction = "set(ngaydem, false);";
        strAction += "set(layer[ngaydem_bt].url, '%SWFPATH%/images/moon.png');";
        strAction += "set(layer[ngaydem_bt].onhover,showtext('Đêm',hotspottextstyle));";
        ngaydem = 1;
        ///
        let el = $(`li[data-scene='scene_du_an_vi_thanh-vi_tri_1-100m']`);
        let thumbDem = el.find('img');
        thumbDem.attr('src', './images/thumb/1.png');
    }
    krpano.call(strAction);
    krpano.call("loadscene(get(xml.scene),null,MERGE,OPENBLEND(1.0, -0.5, 0.3, 0.8, linear))");
}

function viewScene()
{
    let loadAt = false;
    let hlookat = 0;
    let vlookat = 0;
    let sceneNameNow = krpano.get("scene[get(xml.scene)].name");
    for (let i = 0; i < arrScene.length; i++)
    {
        let sceneName = "scene_" + arrScene[i]['scene'];
        if (sceneNameNow == sceneName && arrScene[i]['multi_lookat'])
        {
            hlookat = arrScene[i][folder + "_hlookat"];
            vlookat = arrScene[i][folder + "_vlookat"];
            loadAt = true;
            break;
        }
    }
    if (loadAt)
    {
        krpano.call("set(view.hlookat," + hlookat + ")");
        krpano.call("set(view.vlookat," + vlookat + ")");
    }
}
function loadScene(name)
{
    krpano.call("loadscene(" + name + ",null,MERGE,OPENBLEND(1.0, -0.5, 0.3, 0.8, linear))");
}

$(".menu li:not(.sub_menu)").on("click", function (e)
{
    e.stopPropagation();
    e.preventDefault();
    let el = $(this);
    if (el.data('scene'))
    {
        loadScene(el.data('scene'));
        if (el.data('scene') != 'scene_tienichngoaikhu')
        {
            showHideBtnThumb(1);
        }
    }
});

$(".menu .sub_menu").on("click", function (e)
{
    e.stopPropagation();
    e.preventDefault();
    let el = $(this);
    if (el.hasClass('active'))
    {
        el.removeClass('active');
    } else
    {
        el.addClass('active');
    }
});

function showHiddenUtilities()
{
    if (onUtilities)
    {
        for (let index = 1; index <= 11; index++)
        {
            let hotspot = `utilities_${index}`;
            setOptionHotspot(hotspot, 'visible', 'true');
        }
    } else
    {
        for (let index = 1; index <= 11; index++)
        {
            let hotspot = `utilities_${index}`;
            setOptionHotspot(hotspot, 'visible', 'false');
        }
    }
}

btnUtilities.on("click", function (e)
{
    let el = $(this);
    if (el.hasClass("off"))
    {
        el.removeClass("off");
        onUtilities = true;
        showHiddenUtilities();
    } else
    {
        el.addClass("off");
        onUtilities = false;
        showHiddenUtilities();
    }
});
// Begin: Thumb
const btnThumb = $("#btn-thumb");
const thumb = $(".list-group-thumbnail");
let isChangListFloor = false;

function activeThumbnail()
{
    let nameSceneNow = krpano.get("scene[get(xml.scene)].name");
    let el = $(`li[data-scene='${nameSceneNow}']`);
    $("li.group").removeClass("active");
    el.addClass("active");
}

function showHideBtnThumb(show = 0)
{
    if (show == 1)
    {
        if (!btnThumb.hasClass("show"))
        {
            btnThumb.addClass("show");
            thumb.addClass("show");
        }
        setOptionLayer('btn_back', 'visible', 'true');
        elMenu.hide();
    } else
    {
        btnThumb.removeClass("show");
        thumb.removeClass("show");
        setOptionLayer('btn_back', 'visible', 'false');
        elMenu.show();
    }
}

btnThumb.on("click", function (e)
{
    if (!thumb.hasClass("show"))
    {
        thumb.addClass("show");
    } else
    {
        thumb.removeClass("show");
    }
});

$(".group").on("click", function ()
{
    let name = $(this).data("scene");
    thumb.removeClass("show");
    loadScene(name);
});
// End: Thumb