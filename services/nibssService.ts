
// NIBSS API Simulation
export interface BVNRecord {
    bvn: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    dob: string;
    phone: string;
    base64Image?: string; // Facial image from BVN database
    gender: 'Male' | 'Female';
    status: 'VERIFIED' | 'NOT_FOUND';
}

class NIBSSService {
    private static instance: NIBSSService;

    private constructor() { }

    public static getInstance(): NIBSSService {
        if (!NIBSSService.instance) {
            NIBSSService.instance = new NIBSSService();
        }
        return NIBSSService.instance;
    }

    /**
     * Validates a Bank Verification Number
     */
    public async validateBVN(bvn: string): Promise<BVNRecord> {
        // Simulate API latency
        await new Promise(r => setTimeout(r, 1500));

        if (!/^\d{11}$/.test(bvn)) {
            throw new Error("Invalid BVN Format");
        }

        // Mock Data
        if (bvn === '22220000111') {
            return {
                bvn,
                firstName: "Aliko",
                lastName: "Dangote",
                dob: "1957-04-10",
                phone: "08031234567",
                gender: 'Male',
                status: 'VERIFIED'
            };
        }

        if (bvn === '12345678901') {
            return {
                bvn,
                firstName: "Nneka",
                lastName: "Okonkwo",
                dob: "1985-08-21",
                phone: "07080009999",
                gender: 'Female',
                status: 'VERIFIED'
            }
        }

        // Allow any 11-digit BVN for Demo/Testing user input (e.g., 67387897732)
        if (/^\d{11}$/.test(bvn)) {
            return {
                bvn,
                firstName: "Demo",
                lastName: "User",
                dob: "1990-01-01",
                phone: "08000000000",
                gender: 'Male',
                status: 'VERIFIED'
            };
        }

        throw new Error("BVN Not Found in NIBSS ledger");
    }
}

export const nibssService = NIBSSService.getInstance();
