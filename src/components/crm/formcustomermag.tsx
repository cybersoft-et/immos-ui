import { useState } from "react";

export default function FormCustomerManagment() {
    // const [formData, setFormData] = useState({
    //     storageCharges: {
    //         flOt20: {
    //             day13to17: "",
    //             day18onwards: "",
    //         },
    //         flOt40: {
    //             day8to12: "",
    //             day13to17: "",
    //             day18onwards: "",
    //         },
    //     },
    //     restrictionsAndProhibitions: {
    //         restrictedGoods: {
    //             import: {
    //                 liveAnimals: false,
    //                 plants: false,
    //                 narcotics: false,
    //                 humanRemains: false,
    //                 pharmaceuticalProducts: false,
    //                 medicines: false,
    //                 foodAndDrinks: false,
    //                 radioactiveMaterials: false,
    //                 animalProducts: false,
    //                 bullions: false,
    //                 preciousStones: false,
    //                 liquors: false,
    //                 insecticide: false,
    //                 sword: false,
    //                 chemicals: false,
    //                 steelBars: false,
    //                 nails: false,
    //                 safetyMatches: false,
    //                 waterPump: false,
    //                 lamps: false,
    //                 communicationEquipment: false,
    //                 explosives: false,
    //                 tobacco: false,
    //                 lotteryTickets: false,
    //             },
    //             export: {
    //                 dgRequirements: false,
    //             },
    //         },
    //         prohibitedGoods: {
    //             import: {
    //                 narcotics: false,
    //                 counterfeitGoods: false,
    //                 obsceneMaterials: false,
    //                 firearms: false,
    //                 culturalArtifacts: false,
    //                 endangeredSpecies: false,
    //                 radioactiveMaterials: false,
    //                 wornClothing: false,
    //                 usedRags: false,
    //                 rightSteeringVehicles: false,
    //                 money: false,
    //                 toxicSubstances: false,
    //                 sickAnimals: false,
    //                 sickPlants: false,
    //                 foreignLotteries: false,
    //                 bonds: false,
    //             },
    //             export: {},
    //         },
    //     },
    // });

    const [formData, setFormData] = useState({
        crmRefNo: '',
        date: '',
        companyName: '',
        customerID: '',
        industry: '',
        companyAddress: '',
        city: '',
        businessPhone: '',
        email: '',
        website: '',
        pglStaffName: '',
        updatedBy: '',
        customerCategory: '',
        subCategory: '',
        documentationRequirements: {
            import: {
                personalEffect: false,
                passport: false,
                idWorkPermit: false,
                dutyFree: false,
                billOfLading: false,
                invoice: false,
                packingList: false,
                commercialClients: {
                    billOfLading: false,
                    invoice: false,
                    packingList: false,
                    certificateOfOrigin: false,
                    bankPermit: false,
                    insuranceReceipt: false,
                    freightVouchers: false,
                    containerGuarantee: false,
                    businessLicense: false,
                    agencyContract: false,
                    delegation: false,
                },
                embassyAndInternationalOrgs: {
                    dutyFree: false,
                    billOfLading: false,
                    invoice: false,
                    packingList: false,
                    agencyContract: false,
                    delegation: false,
                },
                projectCargo: {
                    billOfLading: false,
                    invoice: false,
                    packingList: false,
                    voucherBook: false,
                    businessLicense: false,
                    agencyContract: false,
                    delegation: false,
                },
                governments: {
                    preImportPermit: false,
                    billOfLading: false,
                    invoice: false,
                    packingList: false,
                    certificateOfOrigin: false,
                    dataSheet: false,
                    analysisCertificate: false,
                    businessLicense: false,
                    competencyCertificate: false,
                    agencyContract: false,
                    delegation: false,
                },
                automotiveAndMachineries: {
                    billOfLading: false,
                    invoice: false,
                    packingList: false,
                    certificateOfOrigin: false,
                    rtaPermit: false,
                    bankPermit: false,
                    freightVouchers: false,
                    insurance: false,
                    importPermit: false,
                    businessLicense: false,
                    agencyContract: false,
                    poa: false,
                },
                returnee: {
                    passport: false,
                    embassyLetter: false,
                    inventoryList: false,
                    pglInvoice: false,
                    billOfLading: false,
                    agencyContract: false,
                },
            },
            export: {
                garments: {
                    exportBankPermit: false,
                    invoice: false,
                    packingList: false,
                    exportLicense: false,
                    shippingInstruction: false,
                    vgm: false,
                    waybill: false,
                    booking: false,
                },
                mining: {
                    exportLicense: false,
                    invoice: false,
                    packingList: false,
                    bankPermit: false,
                    salesAgreement: false,
                    cleanlinessCertificate: false,
                    releaseForm: false,
                    qualityCertificate: false,
                    agencyContract: false,
                },
                coffee: {
                    exportLicense: false,
                    invoice: false,
                    packingList: false,
                    bankPermit: false,
                    salesAgreement: false,
                    cleanlinessCertificate: false,
                    releaseForm: false,
                    qualityCertificate: false,
                    agencyContract: false,
                },
                spices: {
                    exportLicense: false,
                    invoice: false,
                    packingList: false,
                    bankPermit: false,
                    salesAgreement: false,
                    exportAuthorization: false,
                    agencyContract: false,
                    phytosanitaryCertificate: false,
                    fumigationCertificate: false,
                },
                leatherAndHide: {
                    dutyFree: false,
                    invoice: false,
                    packingList: false,
                    previousDeclaration: false,
                    vehicleClearance: false,
                },
                artAndAntique: {
                    heritageAuthority: false,
                },
            },
        },
        customsRequirements: {
            airShipment: '',
            oceanShipment: '',
            transitPermit: '',
            partialShipments: '',
        },
        portCharges: {
            djiboutiPort: {
                dryContainers: {
                    freeTime: '',
                    day9to15: '',
                    day16to20: '',
                    day21to25: '',
                    day26onwards: '',
                },
                dgReeferContainers: {
                    day1to8: '',
                    day9onwards: '',
                },
                oogContainers: {
                    day1to3: '',
                    day4to15: '',
                    day16to30: '',
                    day31onwards: '',
                },
                terminalHandlingCharges: {
                    importDelivery: '',
                    exportReception: '',
                },
            },
            mombasaPort: '',
            lamuPort: '',
            berberaPort: '',
        },
        shippingLineCharges: {
            cmaCgm: {
                gp20: {
                    day11to20: '',
                    day21to40: '',
                    day41onwards: '',
                },
                gp40: {
                    day11to20: '',
                    day21to40: '',
                    day41onwards: '',
                },
                rf20: {
                    day4to7: '',
                    day8onwards: '',
                },
                rf40: {
                    day4to7: '',
                    day8onwards: '',
                },
                sp20: {
                    day11to20: '',
                    day21to40: '',
                    day41onwards: '',
                },
                sp40: {
                    day11to20: '',
                    day21to40: '',
                    day41onwards: '',
                },
            },
            msc: {
                import: {
                    dv20: {
                        firstPeriod: '',
                        secondPeriod: '',
                        tillEmptyReturn: '',
                    },
                    dcHc40: {
                        firstPeriod: '',
                        secondPeriod: '',
                        tillEmptyReturn: '',
                    },
                },
                export: {
                    dv20: {
                        firstPeriod: '',
                        tillEmptyReturn: '',
                    },
                    dcHc40: {
                        firstPeriod: '',
                        tillEmptyReturn: '',
                    },
                },
            },
            maersk: {
                import: {
                    dv20: {
                        day1to7: '',
                        day7onwards: '',
                    },
                    specialImo20: {
                        day1to7: '',
                        day7onwards: '',
                    },
                    reefer20: {
                        day1to7: '',
                        day7onwards: '',
                    },
                    dcHc40: {
                        day1to7: '',
                        day7onwards: '',
                    },
                    specialImo40: {
                        day1to7: '',
                        day7onwards: '',
                    },
                    reefer40: {
                        day1to7: '',
                        day7onwards: '',
                    },
                },
                export: {
                    dv20: {
                        day1to7: '',
                        day7onwards: '',
                    },
                    specialImo20: {
                        day1to7: '',
                        day7onwards: '',
                    },
                    reefer20: {
                        day1to7: '',
                        day7onwards: '',
                    },
                    dcHc40: {
                        day1to7: '',
                        day7onwards: '',
                    },
                    specialImo40: {
                        day1to7: '',
                        day7onwards: '',
                    },
                    reefer40: {
                        day1to7: '',
                        day7onwards: '',
                    },
                },
            },
            wecLine: {
                dv20: {
                    day31to45: '',
                    day46onwards: '',
                },
                special20: {
                    day31to45: '',
                    day46onwards: '',
                },
                dv40: {
                    day31to45: '',
                    day46onwards: '',
                },
                special40: {
                    day31to45: '',
                    day46onwards: '',
                },
            },
            hapagLloyd: {
                gp20: {
                    firstPeriod: '',
                    thereafter: '',
                },
                temperature20: {
                    thereafter: '',
                },
                special20: {
                    firstPeriod: '',
                    thereafter: '',
                },
                gpHc40: {
                    firstPeriod: '',
                    thereafter: '',
                },
                temperature40: {
                    thereafter: '',
                },
                special40: {
                    firstPeriod: '',
                    thereafter: '',
                },
            },
            messina: {
                dc20: {
                    day8to12: '',
                    day13to17: '',
                    day18onwards: '',
                },
                flOt20: {
                    day8to12: '',
                    day13to17: '',
                    day18onwards: '',
                },
                dc40: {
                    day8to12: '',
                    day13to17: '',
                    day18onwards: '',
                },
                flOt40: {
                    day8to12: '',
                    day13to17: '',
                    day18onwards: '',
                },
            },
        },
        restrictionsAndProhibitions: {
            restrictedGoods: {
                import: {
                    liveAnimals: false,
                    plants: false,
                    narcotics: false,
                    humanRemains: false,
                    pharmaceuticalProducts: false,
                    medicines: false,
                    foodAndDrinks: false,
                    radioactiveMaterials: false,
                    animalProducts: false,
                    bullions: false,
                    preciousStones: false,
                    liquors: false,
                    insecticide: false,
                    sword: false,
                    chemicals: false,
                    steelBars: false,
                    nails: false,
                    safetyMatches: false,
                    waterPump: false,
                    lamps: false,
                    communicationEquipment: false,
                    explosives: false,
                    tobacco: false,
                    lotteryTickets: false,
                },
                export: {
                    dgRequirements: false,
                },
            },
            prohibitedGoods: {
                import: {
                    narcotics: false,
                    counterfeitGoods: false,
                    obsceneMaterials: false,
                    firearms: false,
                    culturalArtifacts: false,
                    endangeredSpecies: false,
                    radioactiveMaterials: false,
                    wornClothing: false,
                    usedRags: false,
                    rightSteeringVehicles: false,
                    money: false,
                    toxicSubstances: false,
                    sickAnimals: false,
                    sickPlants: false,
                    foreignLotteries: false,
                    bonds: false,
                },
                export: {
                    // Add export prohibited goods here
                },
            },
        },
    });


    const handleChange = (category, subcategory, field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [category]: {
                ...prevData[category],
                [subcategory]: {
                    ...prevData[category][subcategory],
                    [field]: value,
                },
            },
        }));
    };

    return (
        // <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-xl">
        //     <h2 className="text-xl font-semibold mb-4">Customs Form</h2>
        <Card className="col-span-2">
            <CardContent>
                <h3 className="font-semibold text-lg mb-4">Customer Managment Form</h3>
            
            {/* Storage Charges Section */}
            <div>
                <h3 className="text-lg font-medium">Storage Charges</h3>
                {Object.keys(formData.documentationRequirements).map((key) => (
                    <div key={key} className="mb-4">
                        <h4 className="font-semibold capitalize">{key}</h4>
                        {Object.keys(formData.documentationRequirements[key]).map((subKey) => (
                            <div key={subKey} className="mb-2">
                                <label className="block text-sm font-medium">
                                    {subKey.replace(/([A-Z])/g, " $1").trim()}:
                                </label>
                                <input
                                    type="text"
                                    value={formData.documentationRequirements[key][subKey]}
                                    onChange={(e) =>
                                        handleChange("storageCharges", key, subKey, e.target.value)
                                    }
                                    className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Restricted Goods Section */}
            <div>
                <h3 className="text-lg font-medium">Restricted Goods - Import</h3>
                <div className="grid grid-cols-2 gap-4">
                    {Object.keys(formData.restrictionsAndProhibitions.restrictedGoods.import).map(
                        (key) => (
                            <label key={key} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.restrictionsAndProhibitions.restrictedGoods.import[key]}
                                    onChange={(e) =>
                                        handleChange(
                                            "restrictionsAndProhibitions",
                                            "restrictedGoods",
                                            "import",
                                            {
                                                ...formData.restrictionsAndProhibitions.restrictedGoods.import,
                                                [key]: e.target.checked,
                                            }
                                        )
                                    }
                                    className="rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                            </label>
                        )
                    )}
                </div>
            </div>
            </CardContent>
        </Card>       
    );
}


function Card({ children, className }) {
    return <div className={`bg-white shadow rounded-lg p-4 ${className}`}>{children}</div>;
  }
    
  function CardContent({ children }) {
    return <div className="p-4">{children}</div>;
  }