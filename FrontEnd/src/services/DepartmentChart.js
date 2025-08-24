// DepartmentChart.js
import React, { useRef, useEffect } from 'react';
import { useI18n } from '../i18n';
import { animations } from '../utils/animations';

export function DepartmentChart({ employees, selectedDepartment, onSelectDepartment }) {
    const { t, theme, gsap, useGSAP } = useI18n();
    const chartRef = useRef();
    const barsRef = useRef([]);

    // Function to get department translation using i18n system
    const getDepartmentTranslation = (deptName) => {
    const key = `departmentNames.${deptName.toLowerCase().replace(/\s+/g, '')}`;
        return t(key) !== key ? t(key) : deptName;
    };

    const deptCounts = employees.reduce((acc, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
        return acc;
    }, {});
    const maxCount = Math.max(...Object.values(deptCounts));

    // GSAP animations
    useGSAP(() => {
        // Animate chart container
        animations.fadeIn(chartRef.current, { delay: 0.2 });
        
        // Animate progress bars with stagger
        if (barsRef.current.length > 0) {
            barsRef.current.forEach((bar, index) => {
                if (bar) {
                    const percentage = (Object.values(deptCounts)[index] / maxCount) * 100;
                    
                    // Animate bar width
                    gsap.fromTo(bar, 
                        { width: '0%' },
                        { 
                            width: `${percentage}%`,
                            duration: 1.2,
                            ease: "power2.out",
                            delay: 0.1 * index
                        }
                    );
                }
            });
        }
    }, [deptCounts, maxCount]);

    // Theme-aware colors
    const getBarGradient = () => {
        return theme === 'dark' 
            ? 'from-blue-400 to-purple-400' 
            : 'from-violet-500 to-purple-500';
    };

    const getCardBg = () => {
        return theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100';
    };

    const getTextColor = () => {
        return theme === 'dark' 
            ? 'text-gray-100' 
            : 'text-gray-900';
    };

    const getSecondaryTextColor = () => {
        return theme === 'dark' 
            ? 'text-gray-300' 
            : 'text-gray-600';
    };

    const getHoverBg = () => {
        return theme === 'dark' 
            ? 'hover:bg-gray-700' 
            : 'hover:bg-gray-100';
    };

    const getSelectedBg = () => {
        return theme === 'dark' 
            ? 'bg-blue-900/50' 
            : 'bg-violet-50';
    };

    return (
        <div 
            ref={chartRef}
            className={`rounded-2xl p-6 shadow-sm border transition-all duration-300 ${getCardBg()}`}
        >
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${getTextColor()}`}>
                {t('departmentDistribution')}
            </h3>
            <div className="space-y-4">
                {Object.entries(deptCounts).map(([dept, count], index) => (
                    <div
                        key={dept}
                        onClick={() => onSelectDepartment(dept)}
                        onMouseEnter={(e) => animations.cardHover(e.currentTarget)}
                        onMouseLeave={(e) => animations.cardHoverOut(e.currentTarget)}
                        className={`cursor-pointer transition-all duration-300 rounded-lg p-2 ${
                            selectedDepartment === dept
                                ? getSelectedBg()
                                : getHoverBg()
                        }`}
                    >
                        <div className="flex justify-between text-sm mb-1">
                            <span className={`font-medium transition-colors duration-300 ${getTextColor()}`}>
                                {getDepartmentTranslation(dept)}
                            </span>
                            <span className={`transition-colors duration-300 ${getSecondaryTextColor()}`}>
                                {count} {t('employee')}
                            </span>
                        </div>
                        <div className={`w-full rounded-full h-3 transition-colors duration-300 ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                            <div
                                ref={(el) => {
                                    if (el) barsRef.current[index] = el;
                                }}
                                className={`bg-gradient-to-r ${getBarGradient()} h-3 rounded-full transition-all duration-700`}
                                style={{ width: '0%' }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
