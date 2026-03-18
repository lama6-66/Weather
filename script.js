const cityInput=document.querySelector(".input-city");
const searchBtn=document.querySelector(".search-btn");
const notFound=document.querySelector(".not-found");
const searchcity=document.querySelector(".search-city");
const weatherinfo=document.querySelector(".weather-info");
const country_txt=document.querySelector(".country-txt");
const temp_txt=document.querySelector(".temp-txt")
const condotion_txt=document.querySelector(".condotion-txt")
const humidity_value=document.querySelector(".humidity-value");
const wind_value=document.querySelector(".wind-value");
const weather_summary_img=document.querySelector(".weather-summary-img");
const current_data=document.querySelector(".current-data");
const forecast_items_container=document.querySelector(".forecast-items-container");
const apiKey='1387f89fd667589252a5194753ec54a8';

searchBtn.addEventListener("click",()=>{
    
    if(cityInput.value.trim() !=''){
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
})

cityInput.addEventListener("keydown",(event)=>{
    if(event.key==="Enter" && cityInput.value.trim() !=''){
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
})

// 
//


async function getFetchData(endPoint,city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response=await fetch(apiUrl)
    return response.json()
}

function getWeaatherIcon(id){
    if(id>=200 && id<=232){
        return 'storm.png'
    }if(id >=300 && id<=321){
        return 'cloudy.png'
    }if(id>= 500 && id<=531){
        return 'rainy-day.png'
    }if(id >=600 && id<=622){
        return 'snow.png'
    }if(id >=701 && id<=781){
        return 'fog.png'
    }if(id<=800){
        return 'sun.png'
    }else{
        return'clouds.png'
    }

}

function getcurrentdata(){
    const currentDate=new Date()
    const options={
        weekday:'short',
        day:'2-digit',
        month:'short'
    }

    return currentDate.toLocaleDateString('en-US',options)
}
    

async function updateWeatherInfo(city){

    const weatherData=await getFetchData('weather',city)
    console.log(weatherData)

    if(weatherData.cod !=200){
        showDisplaySection(notFound)
        return
    } 
    const{
       name:country,
       main:{temp,humidity},
       weather:[{id,main}],
       wind:{speed}
    }=weatherData

   
    country_txt.textContent=country
    temp_txt.textContent=Math.floor(temp)+'°C'
    condotion_txt.textContent=main
    humidity_value.textContent=humidity+'%'
    wind_value.textContent=speed+'M/S'

    current_data.textContent=getcurrentdata()
    console.log(getcurrentdata())

    weather_summary_img.src=`weather/${getWeaatherIcon(id)}`
    // current_data.textContent
        await updateForecastsInfo(city)
        return showDisplaySection(weatherinfo)
  
    
}


async function updateForecastsInfo(city){
    const forecastsData=await getFetchData('forecast',city)
    const timeTaken='12:00:00'
    const todayData=new Date().toISOString().split('T')[0]
    forecast_items_container.innerHTML=''
    forecastsData.list.forEach(forecastWeather =>{
       if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayData)){
        updateForecasastItems(forecastWeather)
         
       }
    })
    
}

function updateForecasastItems(weatherData){

    const{
        dt_txt:date,
        weather:[{id}],
        main:{temp}
    }=weatherData

    const dateTaken=new Date(date)
    const dateOptio={
        day:'2-digit',
        month:"short"
    }

    const dateResult=dateTaken.toLocaleDateString('en-US',dateOptio)

    const forecastItem=`

     <div class="forecast-items">
                        <h5 class="forecast-items-data">${dateResult }</h5>
                        <img src="weather/${getWeaatherIcon(id)}" class="forecast-items-img" />
                        <h5 class="forecast-items-temp">${Math.round(temp)} °C</h5>

                    </div>
    
    `

    forecast_items_container.insertAdjacentHTML('beforeend',forecastItem)
}

function showDisplaySection(section){
  [weatherinfo,searchcity,notFound]
  .forEach(section =>section.style.display="none")

  section.style.display='flex'
}

// searchcity.style.display="none"
