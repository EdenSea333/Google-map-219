import {useState, useEffect} from "react";
import GoogleMapReact from 'google-map-react';

export default function SimpleMap(){
    const [companies, setCompanies] = useState([]);
    const [status, setStatus] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isGeocodingComplete, setIsGeocodingComplete] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isMarkerClicked, setIsMarkerClicked] = useState(false);
    const [map, setMap] = useState(null);
    const [maps, setMaps] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(null);
    const [polylines, setPolylines] = useState([]);
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await fetch(`/api/company/read`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },                                  
                });
                const data = await res.json();
                
                setCompanies(data.companies);
                setStatus("");
            } catch (error) {
                console.error(error); 
            }
        };
        fetchCompanies();

    }, []);


    useEffect(() => {
        const geocodeAddresses = async () => {
            if (companies.length > 0) {
            const geocoder = new window.google.maps.Geocoder();
                
            const promises = companies.map((company) => {
                return new Promise((resolve, reject) => {
                    geocoder.geocode({ address: company.address }, (results, status) => {
                        if (status === window.google.maps.GeocoderStatus.OK && results.length > 0) {
                            const lat = results[0].geometry.location.lat();
                            const lng = results[0].geometry.location.lng();
                            if (lat >= 49 && lat <= 61 && lng >= -8 && lng <= 2) {
                                resolve({ ...company, lat, lng });
                            } else {
                                resolve({ ...company, lat: null, lng: null });
                            }
                        } else {
                            resolve({ ...company, lat: null, lng: null });
                        }
                    });
                });
            });
      
            const updatedCompanies = await Promise.all(promises);
            setCompanies(updatedCompanies);
            setIsGeocodingComplete(true);
        }
    };
    
        geocodeAddresses();
    }, [status]);
    
    const defaultProps = {
        center: {
            lat: 52,
            lng: -2
        },
        zoom: 8
    };
    const AnyReactComponent = ({ text, company, lat, lng}) => {
        const [isHovered, setIsHovered] = useState(false);
        
        const handleMouseEnter = () => {
            setIsHovered(true);
        };
        
        const handleMouseLeave = () => {
            setIsHovered(false);
        };
        
        const handleClick = () => {
            setSelectedCompany(company);
            setIsPanelOpen(true);
            setIsMarkerClicked(true);
            for (let i = 0; i< polylines.length; i++){
                polylines[i].setMap(null); // Remove existing polyline
            }
        };
        const borderStyle = isHovered ? `6px solid ${company.bordercolor}` : `4px solid ${company.bordercolor}`;
        
        return (
            <div className="relative" lat={lat} lng={lng}>
                <div
                    style={{
                        border: `3px solid ${company.hubbordercolor}`, // Add the desired border style
                        margin: '-6px -10px',
                        display: 'inline-block',
                        borderRadius: '100%',
                    }}
                >
                    <div
                        style={{
                        background: company.color,
                        padding: '8px 8px',
                        border: borderStyle,
                        borderRadius: '100%',
                        alignItems: 'center',
                    }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleClick}
                    >
                    </div>
                </div>
                    {text}
                    {isHovered && (
                        <div className="absolute bg-white bg-opacity-80 text-black p-1 border-2 ml-3 border-solid border-black w-96 z-50">
                        <div className="border-b-solid border-b-solid border-b-2 text-center border-slate-600 text-lg uppercase">{company.company}</div>
                        <div className="flex">
                            {company.colocation ? ( <>
                                <p className="text-sm text-blue-400">Colocation Center: &nbsp;</p>
                                <p className="text-sm">{company.colocation}</p> </>) : (
                                    <>
                                        <p className="text-sm text-blue-400">Name: &nbsp;</p>
                                        <p className="text-sm">{company.companyname}</p>
                                    </>
                                )
                            }
                        </div>   
                        <div className="flex">
                            <p className="text-sm text-blue-400">Address: &nbsp;</p>
                            <p className="text-sm">{company.address}</p>
                        </div>    
                    </div>
                    )}

            </div>
        );
    };
    const exampleMapStyles = [
        {
            "featureType": "administrative",
          "elementType": "all",
          "stylers": [
              {
                  "saturation": "-100"
              }
          ]
      },
      {
          "featureType": "administrative.province",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [
              {
                  "saturation": -100
              },
              {
                  "lightness": 65
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [
              {
                  "saturation": -100
              },
              {
                  "lightness": "50"
              },
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "all",
          "stylers": [
              {
                  "saturation": "-100"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "all",
          "stylers": [
              {
                  "lightness": "30"
              }
          ]
      },
      {
          "featureType": "road.local",
          "elementType": "all",
          "stylers": [
              {
                  "lightness": "40"
              }
          ]
      },
      {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [
              {
                  "saturation": -100
              },
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#ffff00"
              },
              {
                  "lightness": -25
              },
              {
                  "saturation": -97
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "labels",
          "stylers": [
              {
                  "lightness": -25
              },
              {
                  "saturation": -100
              }
          ]
      }
    ];

    const handleApiLoaded = (map, maps) => {
        setMap(map);
        setMaps(maps);
        for (let i = 0; i< polylines.length; i++){
            polylines[i].setMap(null); // Remove existing polyline
        }
      };

    const markers = isGeocodingComplete
    ? companies.map(company => {
        if(selectedCompany !== null && selectedCompany.company == company.company){
            return (
                <AnyReactComponent
                    key={company._id}
                    lat={company.lat}
                    lng={company.lng}
                    text={company.name}
                    company={company}
                />
            );
        }
        if (company.lat !== null && company.lng !== null && company.hub === "yes") {
            return (
                <AnyReactComponent
                    key={company._id}
                    lat={company.lat}
                    lng={company.lng}
                    text={company.name}
                    company={company}
                />
            );
      
         } else {
            return null;
        }
    })
    : null;

    const SlidePanel = ({ selectedCompany, onClose }) => {
        return (
            <div className="absolute top-20 right-5 shadow-lg h-100 w-96 bg-opacity-80 bg-white py-3 px-2 border-2 border-solid border-black ">
                <div className="px-1">
                    <div className="text-center uppercase text-xl border-b-2 border-dashed border-b-black mb-3">{selectedCompany.company}</div>
                </div>
                <div className="flex">
                    <p className="text-sm font-bold">Name: &nbsp;</p>
                    <p className="text-sm">{selectedCompany.companyname}</p>
                </div>   
                <div className="flex mb-2">
                    <p className="text-sm font-bold">Role: &nbsp;</p>
                    <p className="text-sm">{selectedCompany.title}</p>
                </div>
                <div className="flex">
                    <p className="text-sm font-bold">Colocation Center: &nbsp;</p>
                    <p className="text-sm">{selectedCompany.colocation}</p>
                </div>   
                <div className="flex mb-3">
                    <p className="text-sm font-bold">Address: &nbsp;</p>
                    <p className="text-sm">{selectedCompany.address}</p>
                </div>   
                <div className="flex mb-3">
                    <p className="text-sm font-bold">No of employee: &nbsp;</p>
                    <p className="text-sm">{selectedCompany.employeecount}</p>
                </div>   
                <div className="flex">
                    <p className="text-sm font-bold">Email: &nbsp;</p>
                    <p className="text-sm">{selectedCompany.email}</p>
                </div>
                <div className="flex mb-15">
                    <p className="text-sm font-bold">Website: &nbsp;</p>
                    <p className="text-sm text-center">{selectedCompany.website}</p>
                </div> 
                    
                <button className="mt-3 ml-72 self-end text-red-500 border-2 border-solid border-red-500 px-3 rounded-lg hover:bg-red-200" onClick={onClose}>Close</button>
            </div>
        );
    };
    const handlePanelClose = () => {
        setIsPanelOpen(false);
        setSelectedCompany(null);
        setIsMarkerClicked(false);
        for (let i = 0; i< polylines.length; i++){
            polylines[i].setMap(null); // Remove existing polyline
        }
    };
    const companyDetails = selectedCompany && isPanelOpen ? (
        <SlidePanel selectedCompany={selectedCompany} onClose={handlePanelClose} />
        ) : null;
    
    useEffect(() => {
        if (map && maps && selectedCompany && isMarkerClicked) {
            for(let i = 0; i<polylines.length; i++){
                polylines[i].setMap(null);
            }
            const filteredCompanies = companies.filter(company=>company.company === selectedCompany.company);
            const hub = filteredCompanies.filter(hub=>hub.hub === "yes");
            const branch = filteredCompanies.filter(company=>company.hub === "no");
            const newPolylines = [];
            if(branch.length >=1){
                for(let i=0;i<branch.length;i++){
    
                    const newPolyline = new maps.Polyline({
                    path: [
                        { lat: hub[0].lat, lng: hub[0].lng },
                        { lat: branch[i].lat, lng: branch[i].lng },
                    ],
                    geodesic: true,
                    strokeOpacity: 0,
                    icons: [
                      {
                        icon: {
                          path: "M 0,-1 0,1",
                          strokeOpacity: 1,
                          scale: 2,
                          strokeColor: selectedCompany.color,
                        },
                        offset: "0",
                        repeat: "10px",
                      },
                    ],
                    });
                    newPolyline.setMap(map);
                    newPolylines.push(newPolyline);
                }
                setPolylines(newPolylines);
            }
        }
    }, [map, maps, selectedCompany, isMarkerClicked]);
    const googleMap = (
        <GoogleMapReact
            bootstrapURLKeys={{ key: }}
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            yesIWantToUseGoogleMapApiInternals
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
            onChange={({ zoom }) => {
                setZoomLevel(zoom);
            }}
    
            options={{
                styles: exampleMapStyles,
            }}
        >
            
            {markers}
        </GoogleMapReact>
    );
   
    
    return (
        <div style={{ height: '95vh', width: '100%' }}>
            {googleMap}
            {companyDetails}
        </div>
  );
}