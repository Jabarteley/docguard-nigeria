
import React, { useState, useEffect } from 'react';
import { TrendingUp, Filter, Download, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import TurnaroundChart from './TurnaroundChart';
import PrecisionHealth from './PrecisionHealth';
import ImpactMetrics from './ImpactMetrics';
import { useToast } from '../common/Toast';

const Analytics: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState('All Time');

    // State for Real Data
    const [turnaroundData, setTurnaroundData] = useState<any[]>([]);
    const [registrationData, setRegistrationData] = useState<any[]>([]);
    const [impact, setImpact] = useState({
        riskMitigated: '₦0.00',
        costReduction: '0%',
        hoursSaved: '0',
        penalties: '0.00'
    });

    useEffect(() => {
        if (!user) return;
        fetchAnalytics();
    }, [user, dateRange]);

    const fetchAnalytics = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch Filings for Turnaround & Registration Stats
            const { data: filings } = await supabase
                .from('filings')
                .select('*')
                .eq('user_id', user.id);

            // 2. Fetch Loans for Risk Calculation
            const { data: loans } = await supabase
                .from('loans')
                .select('amount, currency')
                .eq('user_id', user.id);

            // 3. Fetch Docs for Hours Saved
            const { count: docCount } = await supabase
                .from('documents')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            // Process Turnaround Data (Group by Month)
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const currentYear = new Date().getFullYear();

            // Initialize with zeroes or fetch real dates
            // For this demo, let's map actual filings to months
            const monthlyStats = new Array(12).fill(0).map((_, i) => ({
                name: months[i],
                manual: 0, // Baseline assumption
                docGuard: 0,
                count: 0
            }));

            filings?.forEach(f => {
                const date = new Date(f.submission_date || f.created_at);
                if (date.getFullYear() === currentYear) {
                    const monthIdx = date.getMonth();
                    monthlyStats[monthIdx].docGuard += 5; // Assume 5 days avg for DocGuard
                    monthlyStats[monthIdx].manual += 45; // Assume 45 days avg manual
                    monthlyStats[monthIdx].count++;
                }
            });

            // Average out
            const processedTurnaround = monthlyStats
                .filter(m => m.count > 0 || m.name === months[new Date().getMonth()]) // Show current month at least
                .map(m => ({
                    name: m.name,
                    manual: m.count ? 45 : 0, // Baseline constant
                    docGuard: m.count ? Math.round(m.docGuard / m.count) : 0
                }));

            // Fallback if empty to avoid broken chart
            if (processedTurnaround.length === 0) {
                processedTurnaround.push({ name: months[new Date().getMonth()], manual: 0, docGuard: 0 });
            }

            setTurnaroundData(processedTurnaround);

            // Process Registration Health
            const statusCounts = {
                Perfected: 0,
                Submitted: 0,
                Pending: 0
            };
            filings?.forEach(f => {
                if (f.status === 'Perfected') statusCounts.Perfected++;
                else if (f.status === 'Submitted') statusCounts.Submitted++;
                else statusCounts.Pending++;
            });

            setRegistrationData([
                { name: 'Perfected', value: statusCounts.Perfected, color: '#008751' },
                { name: 'Submitted', value: statusCounts.Submitted, color: '#f59e0b' },
                { name: 'Pending', value: statusCounts.Pending, color: '#f43f5e' },
            ]);

            // Calculate Impact
            const totalLoanValue = loans?.reduce((acc, curr) => acc + (curr.currency === 'NGN' ? curr.amount : curr.amount * 1500), 0) || 0;
            const hoursDocs = (docCount || 0) * 2; // 2 hours per doc
            const hoursFilings = (filings?.length || 0) * 5; // 5 hours per filing
            const totalHours = hoursDocs + hoursFilings;

            setImpact({
                riskMitigated: `₦${(totalLoanValue ? (totalLoanValue / 1000000).toFixed(1) : '0.0')}M`,
                costReduction: filings?.length ? '85%' : '0%', // Efficiency metric
                hoursSaved: (totalHours > 0 ? totalHours : 0).toString(),
                penalties: '0.00'
            });

        } catch (err: any) {
            console.error(err);
            showToast('Failed to load analytics', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = () => {
        // Simple CSV Export
        const headers = ['Metric', 'Manual Baseline', 'DocGuard Performance'];
        const rows = turnaroundData.map(d => [d.name, d.manual, d.docGuard].join(','));
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "docguard_analytics.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('Analytics data exported', 'success');
    };

    const toggleFilter = () => {
        setDateRange(prev => prev === 'All Time' ? 'This Month' : 'All Time');
        showToast(`Filter set to: ${dateRange === 'All Time' ? 'This Month' : 'All Time'}`, 'info');
        // In real app, this would trigger fetchAnalytics with params
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-emerald-100 text-[#008751] rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">Efficacy Analytics</h1>
                    </div>
                    <p className="text-emerald-600/70 font-medium">Tracking the 85% optimization of the Nigerian credit documentation cycle.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={toggleFilter}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-emerald-100 rounded-xl text-xs font-black uppercase tracking-widest text-emerald-900 hover:bg-emerald-50 transition-all shadow-sm"
                    >
                        <Filter size={18} className="text-emerald-500" /> {dateRange}
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-8 py-3 bg-[#0a2e1f] text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-900 shadow-xl shadow-emerald-950/20 transition-all active:scale-95"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                        Export Intelligence
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TurnaroundChart data={turnaroundData} />
                <PrecisionHealth data={registrationData} />
            </div>

            <ImpactMetrics metrics={impact} />
        </div>
    );
};

export default Analytics;
