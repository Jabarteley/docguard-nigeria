
// FIRS API Simulation
export interface TaxEntity {
    tin: string;
    taxpayerName: string;
    taxOffice: string;
    activeStatus: 'Active' | 'Inactive';
    email: string;
}

class FIRSService {
    private static instance: FIRSService;

    private constructor() { }

    public static getInstance(): FIRSService {
        if (!FIRSService.instance) {
            FIRSService.instance = new FIRSService();
        }
        return FIRSService.instance;
    }

    /**
     * Validates a Tax Identification Number (TIN - Corporate or Individual)
     */
    public async validateTIN(tin: string): Promise<TaxEntity> {
        // Simulate API latency
        await new Promise(r => setTimeout(r, 1200));

        if (tin === '1000234567') {
            return {
                tin,
                taxpayerName: "DANGOTE INDUSTRIES LIMITED",
                taxOffice: "MSTO IKOYI",
                activeStatus: "Active",
                email: "tax@dangote.com"
            };
        }

        if (tin === '2000555666') {
            return {
                tin,
                taxpayerName: "LMA NIGERIA DEMO LTD",
                taxOffice: "MSTO VI",
                activeStatus: "Active",
                email: "finance@lmademo.ng"
            };
        }

        throw new Error("TIN Not Found or Inactive");
    }
}

export const firsService = FIRSService.getInstance();
