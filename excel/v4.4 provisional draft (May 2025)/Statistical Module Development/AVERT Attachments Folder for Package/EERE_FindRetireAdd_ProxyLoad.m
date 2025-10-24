function [MigrateDistance] = EERE_FindRetireAdd_ProxyLoad(GenAvgOutputArray,LoadCatsAnnual,UnitStruct,LoadCatCyc);

RetireIX = find([UnitStruct.Retired])';
NewUnitIX = find([UnitStruct.NewUnit])';
OrigIX = find([UnitStruct.Original])';

ploton = 0;

SumGenAvgOutputArray = sum(GenAvgOutputArray(OrigIX,:));

LoadDemandNow = LoadCatsAnnual(LoadCatCyc);
OutputNow = SumGenAvgOutputArray(LoadCatCyc);

if isempty(RetireIX) && isempty(NewUnitIX)
    MigrateDistance = 0;
    if ploton
        disp(sprintf('At %1.0f, MigrateDistance = 0',LoadDemandNow))
    end
else
    
    tprime = sum(GenAvgOutputArray(OrigIX,:),1)'...
        + sum(GenAvgOutputArray(NewUnitIX,:),1)' ...
        - sum(GenAvgOutputArray(RetireIX,:),1)';
    
    if ploton
        figure(4); clf; set(gcf,'color','w');
        plot(LoadCatsAnnual,tprime,'rd-'); hold on;
        plot(LoadCatsAnnual,SumGenAvgOutputArray,'bd-');
        axis image; grid on;
        ylabel('Average Generation to meet Load Categories');
        xlabel('LoadCats (annual)');
        plot(LoadCatsAnnual(LoadCatCyc),SumGenAvgOutputArray(LoadCatCyc),'k+')
    end
    
    UpperBound = (find(tprime>=OutputNow,1,'first'));
    LowerBound = (find(tprime<=OutputNow,1,'last'));
    
    if UpperBound == LowerBound
        tprimeCrossover = LoadCatsAnnual(UpperBound);
    else
        if isempty(UpperBound)
            tprimeCrossover = LoadCatsAnnual(LowerBound);
        else if isempty(LowerBound)
                tprimeCrossover = LoadCatsAnnual(UpperBound);
            else
                
                FractionOfSlope = (OutputNow-tprime(LowerBound)) ./ ...
                    (tprime(UpperBound)-tprime(LowerBound));
                
                tprimeSlope = (LoadCatsAnnual(UpperBound)-LoadCatsAnnual(LowerBound)) ./ ...
                    (tprime(UpperBound)-tprime(LowerBound));
                
                tprimeCrossover = (OutputNow-tprime(LowerBound)) .* ...
                    tprimeSlope+LoadCatsAnnual(LowerBound);
            end
        end
    end
    
    MigrateDistance =  tprimeCrossover-LoadDemandNow;
    if ploton
        disp(sprintf('At %1.0f, MigrateDistance = %1.0f',LoadDemandNow,MigrateDistance))
    end
    
    if ploton
        plot([tprimeCrossover tprimeCrossover],[0 max(tprime)],'g-')
        pause(.2);
    end
end 
