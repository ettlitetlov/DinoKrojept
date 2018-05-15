%% Projektexperiment
clear;
clc
formatSpec = '%{yyyy-M-dd HH:mm:ss}D%d%C%C';

T = readtable('comm-data-Fri.csv', 'Delimiter', 'comma','Format', formatSpec);

%%
hashMap = containers.Map('KeyType', 'int32', 'ValueType', 'any');
for i = 1:length(T.from)
    if(isKey(hashMap, T.from(i)))
        hashMap(T.from(i)) = [hashMap(T.from(i)) T.to(i)];
    else
        hashMap(T.from(i)) = T.to(i);
    end
end

%% Exempel på unik

fromUnique = unique(T.from);

hashRows = zeros(2950,1);

for i = 1:2950
    hashRows(i) = length(hashMap(fromUnique(i)));
end

hashMatrix = ones(2950,38658);
hashMatrixC = categorical(hashMatrix);

for i = 1:2950
    for j = 1:length(hashMap(fromUnique(i)))
        tmp = hashMap(fromUnique(i));
        hashMatrixC(i,j) = tmp(j);
    end
end