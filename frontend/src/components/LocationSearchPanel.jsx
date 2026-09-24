import React from 'react'

const LocationSearchPanel = ({
    suggestions = [],
    setPanelOpen,
    setVehiclePanel,
    setPickup,
    setDestination,
    activeField
}) => {

    const handleSuggestionClick = (suggestion) => {
        const text = typeof suggestion === 'string'
            ? suggestion
            : (suggestion?.display_name || suggestion?.description || suggestion?.display_place || '');

        if (activeField === 'pickup') {
            setPickup(text)
        } else if (activeField === 'destination') {
            setDestination(text)
        }
    }

    return (
        <div>
            {
                suggestions.map((elem, idx) => {
                    const locationText = typeof elem === 'string'
                        ? elem
                        : (elem?.display_name || elem?.description || elem?.display_place || '');

                    return (
                        <div 
                            key={idx} 
                            onClick={() => handleSuggestionClick(elem)} 
                            className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start cursor-pointer hover:bg-gray-50 transition-colors'
                        >
                            <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full shrink-0'>
                                <i className="ri-map-pin-fill"></i>
                            </h2>
                            <h4 className='font-medium text-sm text-gray-800 line-clamp-2'>{locationText}</h4>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default LocationSearchPanel
